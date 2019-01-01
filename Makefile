all: package

.PHONY: package
package:
	./package.sh

clean:
	rm -f *.zip
